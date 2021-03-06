import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, Input, TemplateRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
//////// SERVICES 
import { Citas } from 'src/app/services/services-data/citas.services';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})

export class CalendarioComponent  {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    //   a11yLabel: 'Edit',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent('Edited', event);
    //   },
    // },
    // {
    //   label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //   a11yLabel: 'Delete',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   },
    // },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  // [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red.primary,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow.primary,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue.secondary,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow.secondary,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = true;
 

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    //console.log('Data '+ date);

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {

    

    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {

        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        //actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



  //////////////////////////////////////////////////////////////////////
  @Input() 
  id_usuario : any = '';
  @Input()
  roll       : any = '' ;
 
  //////////////////////////////////////////////////////////////////////
  Events   : any  = [];  
  AllCitas : any  = [];

                  
   constructor( private CitasService   : Citas,
                private modal: NgbModal ) { }

  ngOnInit(): void {
    
    console.log(' Formato de fecha : '+startOfDay(new Date()))
    this.ListCitas()
    
  }
   /////////////////////// COMPONENTS EVENT ///////////////////////////////
  
  async ListCitas(){
    
    //alert('se jue cole');
    await this.CitasService.GetCitasCalendario(this.id_usuario,  this.roll, '1', '').subscribe(
      async ( res : any ) => {
        
        this.AllCitas = await res.citas; 
        
        for (let index = 0; index < this.AllCitas.length; index++) {
            let element = this.AllCitas[index];
            this.events = [
              ...this.events,
              {
                title: element.title,
                start: new Date(element.start),//startOfDay(element.start),
                end:   new Date(element.end),//endOfDay(element.emd),
                actions: this.actions,  
                
                color: element.color,
                draggable: true,  
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                } 
              },
            ];

        }/// END FOR 
 

        //this.events   = res.citas;

        
        
        //Calendar.addEvent( event, [ this.AllCitas ] );
        
        //var calendar = new Calendar( event, [ this.AllCitas ] )
 
        if( this.AllCitas.length == 0 ){
          await alert('No hay citas aun')
        }else{
          //this.calendarOptions;
        }
      }
    )
    //this.ngAfterViewInit();
  }

  

}

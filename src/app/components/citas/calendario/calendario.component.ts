import { AfterViewInit, Directive, Component, EventEmitter, Output, Renderer2, ViewChild, OnInit, Input } from '@angular/core';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';  
import { Citas } from 'src/app/services/services-data/citas.services';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
import { HttpClient } from '@angular/common/http';

import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';


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

@Directive({
  selector: '[fullCalendar]',
  exportAs:'fullCalendar'
})

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})

export class CalendarioComponent implements OnInit {

  //////////////////////////////////////////////////////////////////////
  @Input() 
  id_usuario : any = '';
  @Input()
  roll       : any = '' ;
 
  //////////////////////////////////////////////////////////////////////
 
  selectedDate = moment();
  minDate: moment.Moment | undefined;
  maxDate: moment.Moment | undefined;

  @Output()
  dateSelected: EventEmitter<moment.Moment> = new EventEmitter();

  @Output()
  monthSelected: EventEmitter<moment.Moment> = new EventEmitter();

  @ViewChild('calendar', { static: true })
  calendar: any|undefined; 
  //calendar:  MatCalendar<moment.Moment> |undefined; 


  //@ViewChild('calendar')
  calendarComponent: FullCalendarComponent | undefined;

  //   /////////////////////////////////////////////////////////
  //AllCitas : any  = [{ title: 'evento 1', date: '2021-12-01' }, { title: 'evento 2', date: '2021-12-02' }];
  AllCitas : any  = [];

                  
   constructor( private renderer       : Renderer2,
                private CitasService   : Citas ) { }

  ngOnInit(): void {

     console.log('Data1 :' + this.id_usuario + ' Data2 :' + this.roll)
     this.ListCitas()
   }

   calendarOptions: CalendarOptions = {
     initialView: 'dayGridMonth',
     dateClick: this.handleDateClick.bind(this),  //bind is important!

     events: this.AllCitas
   };

  handleDateClick( arg : any ) {
    alert('date click! ' + arg.dateStr)
  }

   setMinDate() {
     this.minDate = moment().add(-10, 'day');
   }

   setMaxDate() {
     this.maxDate = moment().add(10, 'day');
   }

   toggleWeekends() {
     this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');

    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          this.monthSelected.emit(this.calendar.activeDate);
        });
      });
    }
  }
 
  /////////////////////// COMPONENTS EVENT ///////////////////////////////

  
  async ListCitas(){
    
    await this.CitasService.GetCitas(this.id_usuario,  this.roll).subscribe(
      async ( res : any ) => {
        
        this.AllCitas = res.citas;

        $('#calendar').fullCalendar({
          events: [
            this.AllCitas
          ]
        }); 
        //alert("Data's come")
        console.log({ tasaData : this.AllCitas});
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

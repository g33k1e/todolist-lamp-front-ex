import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemShow } from './models/item-show';
import { TodolistService } from './services/todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo';
  @ViewChild('newItem') private newItem:ElementRef;
  editActive:boolean = false;
  id:string;
  allItems:ItemShow[] = [];
  todoForm:FormGroup;

  constructor(private todolist:TodolistService, private fb:FormBuilder){
    this.id = '';
    this.todoForm = this.fb.group({
      description:['',Validators.required]
    })
    this.newItem = new ElementRef('');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getItems();
  }

  getItems():void{
    this.todolist.getTodoList().subscribe((result:ItemShow[])=>{
      this.allItems = result;
      console.log('id is: ',this.allItems[0].id);

    });
  }


  addItem(description: string) {

    if(description === ''){
      return;
    }

    this.newItem.nativeElement.value = '';

    this.todolist.addTodo(description).subscribe(result=>{
      if(result){
        this.getItems();
      }
    })

  }

  editTodo(index:number):void{

    this.editActive = true;
    this.id = this.allItems[index].id;
    this.todoForm.patchValue({description:this.allItems[index].description});




  }

  sendEditTodo():void{

    this.editActive = false;

    this.todolist.editTodo(this.id,this.todoForm.get('description')?.value).subscribe(res=>{
      if(res){
        this.getItems();
      }
    })

  }

  deleteItem(index:number):void{


    this.todolist.deleteTodo(this.allItems[index].id).subscribe(result=>{
      if(result){
        this.getItems();
      }
    })

  }
}

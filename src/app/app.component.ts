import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  
  faTrash = faTrash;
  myForm!: FormGroup;
  totalSaved: number = 0;
  totalString!: string;
  tableData: any = [];
  minDate: Date = new Date(Date.now());
  title = "Saving Goal Calculator";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      goals: this.fb.array([])
    });

    this.addGoal();
  }

  get goalsForm(): FormArray {
    return this.myForm.get('goals') as FormArray;
  }

  addGoal(): void {
    const goal = this.fb.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
      date: ['', [Validators.required]]
    });

    this.goalsForm.push(goal);
  }

  deleteGoal(i: number): void {
    this.goalsForm.removeAt(i);
  }

  submitGoals(): void {
    let inputGoals = this.goalsForm.value;

    for (let i = 0; i < inputGoals.length; i++) {
      let calculatedGoal: any = {};
      calculatedGoal.name = inputGoals[i].name;
      calculatedGoal.amountToSave = this.calculateMonthlySaving(inputGoals[i].amount, inputGoals[i].date);
      calculatedGoal.goalDate = inputGoals[i].date;
      this.totalSaved += parseFloat(inputGoals[i].amount);
      this.tableData.push(calculatedGoal);
    }

    this.totalString = "Your total savings goal is £" +this.totalSaved+ " You should save these amounts each month:"
    

  }

  calculateMonthlySaving(amount: number, dateTo: Date): string {

    let dateFrom = new Date(Date.now());
    let numMonths =  dateTo.getMonth() - dateFrom.getMonth() + 
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
    
    if (numMonths <= 0) {
      return amount.toString();
    }
    
    return (amount / numMonths).toString();
  }

  resetForm(): void {
    this.myForm = this.fb.group({
      goals: this.fb.array([])
    });

    this.addGoal();
    this.tableData = [];
    this.totalSaved = 0;
    this.totalString = "";
  }

}

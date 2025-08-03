import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit{

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Excercise>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private trainingService: TrainingService){}

  ngOnInit(): void {
    this.trainingService.fetchAllPastExcercises();

    this.trainingService.finishedExEvent.subscribe(
      data => this.dataSource.data = data
    );
  }

  ngAfterViewInit(): void {
    if(this.sort)
      this.dataSource.sort = this.sort;

    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }
  }

  doFilter(filterValue: any){
    console.log(filterValue);
    this.dataSource.filter = filterValue?.value?.trim().toLocaleLowerCase();
  }

}

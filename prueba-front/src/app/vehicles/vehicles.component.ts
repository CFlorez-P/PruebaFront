import { Component } from '@angular/core';
import { VehicleService } from '../shared/services/vehicle.service';
import { VehicleValue } from '../shared/entities/vehicleValue';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Vehicle } from '../shared/entities/vehicle';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent {

  public formGroup: FormGroup;
  public FORM_GROUP_SEARCH_SERVICE: string = 'formSearchService';
  public FORM_CONTROL_STATION: string = 'stationCtrl';
  public FORM_CONTROL_FROM_DATE: string = 'fromDateCtrl';
  public FORM_CONTROL_TO_DATE: string = 'toDateCtrl';

  public stations: string[] = [];
  public dates: string[] = [];
  public vehicleData: Vehicle[]=[];
  public vehicleValueData: VehicleValue[]=[];

  public showVehicleValueData = false;
  public showVehicleGeneralData = false;
  public pageIndex: number = 1;
  private orderDescOrAsc = false;

  public totalValorTabuladoCalculado: string = '';
  public totalCantidadCalculado: number = 0;

  constructor(private vehicleService: VehicleService, private fb: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.formGroup = this.buildFormSearch();
   }

  ngOnInit() {
    this.getStations();
    this.getDates();
    this.getVehicleValueData();
  }

  private buildFormSearch(): FormGroup {
    return new FormGroup({
      formSearchService: new FormGroup({
        stationCtrl: new FormControl(''),
        fromDateCtrl: new FormControl(''),
        toDateCtrl: new FormControl(''),
        pageSizeCtrl: new FormControl('')
      })
    });
  }

  public showData():void {
    this.showVehicleValueData = false;
    this.showVehicleGeneralData = true;
    this.getVehicleData();

  }

  public showValueData():void {
    this.showVehicleGeneralData = false;
    this.showVehicleValueData = true;

    if(this.vehicleValueData.length<=0){
      this.getVehicleValueData();
    }
  }

  public getVehicleData(): void {
    this.showVehicleValueData = false;

    let formValue = this.formGroup?.get(this.FORM_GROUP_SEARCH_SERVICE)?.value;
    let estacion = formValue[this.FORM_CONTROL_STATION];
    let fromDateObj = formValue[this.FORM_CONTROL_FROM_DATE];
    let fechaDesde = fromDateObj ? `${fromDateObj.year}-${fromDateObj.month}-${fromDateObj.day}`: fromDateObj;
    let toDateObj = formValue[this.FORM_CONTROL_TO_DATE];
    let fechaHasta = toDateObj? `${toDateObj.year}-${toDateObj.month}-${toDateObj.day}`: toDateObj;
    let pageSize = 250

    this.vehicleService.getVehicleData(this.pageIndex, pageSize, estacion, fechaDesde, fechaHasta)
      .subscribe((vehicles: Vehicle[]) => {
        this.vehicleData = vehicles;
      });
  }

  public getVehicleValueData(): void{
    this.showVehicleGeneralData = false;

    if(this.vehicleValueData.length<=0){
      this.vehicleService.getVehicleValueData().subscribe((values: VehicleValue[]) => {
        this.vehicleValueData = values;
      });
    }
  }

  private getStations(): void{
    this.vehicleService.getStations().subscribe((stations: string[]) => {
      this.stations = stations;
    });
  }

  private getDates(): void{
    this.vehicleService.getDates().subscribe((dates: string[]) => {
      this.dates = dates;
    });
  }

  public nextPage(): void{
    this.pageIndex ++;
    this.getVehicleData();
  }

  public previousPage(): void{
    if(this.pageIndex > 1){
      this.pageIndex--;
      this.getVehicleData();
    }
  }

  public onClickOrderByCamp(camp: string): void {
    if (this.vehicleData) {
      if (!this.orderDescOrAsc) {
        this.vehicleData = this.vehicleData.sort((a, b) =>
          a[camp] > b[camp] ? 1 : a[camp] < b[camp] ? -1 : 0
        );
      } else {
        this.vehicleData = this.vehicleData.sort((a, b) =>
          a[camp] > b[camp] ? -1 : a[camp] < b[camp] ? 1 : 0
        );
      }
      this.orderDescOrAsc = !this.orderDescOrAsc;
    }
  }

  public setCorrectValues(station: string, date:string): void {
    const value = this.vehicleValueData.find(x => x.fecha === date && x.estacion === station);
    this.totalCantidadCalculado = value?.totalCantidad || 0
    this.totalValorTabuladoCalculado = this.currencyPipe.transform(value?.totalValorTabulado || 0, 'COP', 'symbol', '1.0-2') || '';
  }

}

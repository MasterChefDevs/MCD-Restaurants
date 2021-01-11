import { Injectable } from '@angular/core';
import { RestaurantServiceApi } from 'src/app/api/restaurant/restaurantApi';
import { Reservation } from 'src/app/models/reservation';
import { Restaurant } from 'src/app/models/restaurant';
import { Table } from 'src/app/models/table';
import { Wall } from 'src/app/models/wall';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private restaurantServiceApi: RestaurantServiceApi) { }

  async getAll(): Promise<Restaurant[]> {
    return await this.restaurantServiceApi.getAll();
  }

  async filter(keyword: string): Promise<Restaurant[]> {
    const restaurants = await this.restaurantServiceApi.getAll();
    return restaurants.filter(item => item.nameR.startsWith(keyword));
  }

  async getWalls(): Promise<Wall[]> {
    const walls = await this.restaurantServiceApi.getWalls();
    return walls;
  }

  async getTables(): Promise<Table[]> {
    const tables = await this.restaurantServiceApi.getTables();
    return tables;
  }

  async getReservations(): Promise<Reservation[]> {
    const reservations = await this.restaurantServiceApi.getReservations();
    return reservations;
  }

  isAvailable(reservations: Reservation[], table: Table) {
    if (!reservations) {
      return false;
    }
    const tableReservations = reservations.filter(item => item.id_M === table.id);
    for (let item of tableReservations) {
      const reservationTime = new Date(item.data + " " + item.ora);
      const now = new Date();
      const nowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, now.getMinutes(), now.getSeconds());
      const reservationStart = new Date(reservationTime.getFullYear(), reservationTime.getMonth(),
        reservationTime.getDate(), reservationTime.getHours(), reservationTime.getMinutes(), reservationTime.getSeconds());
      const reservationEnd = new Date(reservationTime.getFullYear(), reservationTime.getMonth(),
        reservationTime.getDate(), reservationTime.getHours() + 2, reservationTime.getMinutes(), reservationTime.getSeconds());
      if (reservationStart <= nowEnd && now <= reservationEnd) {
        return false;
      }
    }
    return true;
  }
}
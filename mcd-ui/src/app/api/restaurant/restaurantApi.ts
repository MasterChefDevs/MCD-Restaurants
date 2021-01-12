import { Injectable } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';
import { Table } from 'src/app/models/table';
import { Wall } from 'src/app/models/wall';
import ajax from 'superagent';
import config from '../../config/index';

@Injectable({
    providedIn: 'root'
})

export class RestaurantServiceApi {
    async getAll(): Promise<Restaurant[]> {
        const resp = await ajax
            .get(config.endpoint.restaurant.list)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json');
        return resp.body;
    }

    async getWalls(): Promise<Wall[]> {
        const resp = await ajax
            .get(config.endpoint.restaurant.walls)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json');
        return resp.body;
    }

    async getTables(): Promise<Table[]> {
        const resp = await ajax
            .get(config.endpoint.restaurant.tables)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json');
        return resp.body;
    }

    async getReservations() {
        const resp = await ajax
            .get(config.endpoint.restaurant.reservations)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json');
        return resp.body;
    }

    async submitReview(comment: string, stars: number, idR: number) {
        const token = localStorage.getItem('TOKEN');
        const resp = await ajax
            .post(config.endpoint.restaurant.reviews)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send({
                id_R: idR,
                id_U: token,
                nr_stele: stars,
                mesaj: comment,
                data: new Date().toISOString().slice(0, 19).replace('T', ' ')
            });
        return resp;
    }

    async getAllReviews() {
        const resp = await ajax
            .get(config.endpoint.restaurant.reviews)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json');
        return resp.body;
    }

    async getStatisticsByDay(id_restaurant: number, id_day: number) {
        const resp = await ajax
            .post(config.endpoint.restaurant.statistics.byDay)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Accept', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .send({
                id: id_restaurant,
                id_day
            });
        return resp;
    }

    async submitReservation(tableId: number, phone: string, name: string, email: string) {
        const token = localStorage.getItem('TOKEN');
        const now = new Date();
        const resp = await ajax
            .post(config.endpoint.restaurant.reservations)
            .timeout({ deadline: 30000 })  //30 seconds
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .send({
                "id_M": tableId,
                "id_U": token,
                "data": now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(),
                "ora": now.getHours() + ":" + now.getMinutes(),
                "timp": (now.getHours() + 2) + ":" + now.getMinutes(),
                "telefon": phone,
                "nume_pers": name,
                email
            });
        return resp;
    }

    async getStatisticsByDayByHour() { }
}
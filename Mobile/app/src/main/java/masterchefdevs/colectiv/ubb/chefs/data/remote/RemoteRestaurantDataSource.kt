package masterchefdevs.colectiv.ubb.chefs.data.remote

import android.util.Log
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import masterchefdevs.colectiv.ubb.chefs.core.Result
import masterchefdevs.colectiv.ubb.chefs.core.TAG
import masterchefdevs.colectiv.ubb.chefs.core.UnsecuredApi
import masterchefdevs.colectiv.ubb.chefs.data.model.*
import retrofit2.http.*
import java.util.Date

object RemoteRestaurantDataSource {

    interface RestaurantService {
        @Headers("Content-Type: application/json")
        @POST("/statisticsByDay")
        suspend fun getStatByDay(@Body id: IdDto): DayStatDTO

        @Headers("Content-Type: application/json")
        @POST("/statisticsByDayByHour")
        suspend fun getStatByHour(@Body id: IdDayDto): JsonElement

        @Headers("Content-Type: application/json")
        @POST("/getReviewAverage")
        suspend fun getRating(@Body id: IdDto): JsonElement

        @Headers("Content-Type: application/json")
        @GET("/api/restaurant/{id}")
        suspend fun getRestaurant(@Path("id") id: Number): Restaurant

        @Headers("Content-Type: application/json")
        @POST("/api/mese/getTables/")
        suspend fun getTables(@Body id: IdDto): List<Table>

        @Headers("Content-Type: application/json")
        @POST("/api/pereti/getWalls/")
        suspend fun getWalls(@Body id: IdDto): List<Wall>

        @Headers("Content-Type: application/json")
        @POST("/getRezervareForRestaurant")
        suspend fun getRezervari(@Body dayRes: RequestResDTO): List<Reservation>
    }

    private val restaurantService: RestaurantService = UnsecuredApi.retrofit.create(RestaurantService::class.java)

    suspend fun getRating(id: Int): Result<Float>{
        try {
            val idDto = IdDto(id)
            val a = restaurantService.getRating(idDto)
            val value: Float =  (a as JsonObject).get("Average").asFloat
            return Result.Success(value)
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun getDayStat(id: Int): Result<DayStatDTO> {
        try {
            val idDto = IdDto(id)
            return Result.Success(restaurantService.getStatByDay(idDto))
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun getDayStatHour(id: Int, id_day: Int): Result<List<Int>> {
        try {
            val idDayDto = IdDayDto(id, id_day)
            val a = restaurantService.getStatByHour(idDayDto)
            val a0 = (a as JsonObject).get("0-2").asInt
            val a2 = a.get("2-4").asInt
            val a4 = a.get("4-6").asInt
            val a6 = a.get("6-8").asInt
            val a8 = a.get("8-10").asInt
            val a10 = a.get("10-12").asInt
            val a12 = a.get("12-14").asInt
            val a14 = a.get("14-16").asInt
            val a16 = a.get("16-18").asInt
            val a18 = a.get("18-20").asInt
            val a20 = a.get("20-22").asInt
            val a22 = a.get("22-24").asInt
            val lista: List<Int> = listOf(a0,a2,a4,a6,a8,a10,a12,a14,a16,a18,a20,a22)

            Log.d(TAG, "primit: ---" + a.toString());
            return Result.Success(lista)
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun getRestaurant(id: Number): Result<Restaurant> {
        try {
            val a =restaurantService.getRestaurant(id)
            val aa = Result.Success(a);
            return aa
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }
    suspend fun getMese(id: Number): Result<List<Table>> {
        try {
            val idDto = IdDto(id.toInt())
            val a = Result.Success(restaurantService.getTables(idDto))
            return a
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun getPereti(id: Number): Result<List<Wall>> {
        try {
            val idDto = IdDto(id.toInt())
            val a = Result.Success(restaurantService.getWalls(idDto))
            return a
        } catch (e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun getRezervari(id: Number, data: String): Result<List<Reservation>> {
        Log.d(TAG, "inainate de send req rezervari")
        try {
            val sendObj = RequestResDTO(id.toInt(), data)
            val a = Result.Success(restaurantService.getRezervari(sendObj))
            Log.d(TAG, "dupa de send req rezervari")
            return a
        } catch (e: Exception) {
            return Result.Error(e)
        }

    }

}
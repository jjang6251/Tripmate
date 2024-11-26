export class CreateDetailTripDto {
    readonly tripId: number;
    readonly placeName: string;
    readonly placeLocation: string;
    readonly order: number;
    readonly tripTime: string;
    readonly day: number;
}
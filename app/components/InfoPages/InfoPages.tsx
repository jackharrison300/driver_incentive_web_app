// TODO pull info from database functions

export interface PersonalInfo {
    name: String,
    pfp: String,
    email: String,
    phoneNumber: String
 }

 export interface DriverInfo extends PersonalInfo {
    points: String
 }
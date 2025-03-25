export class User {
    id: number; 
    name: string;
    email: string;
    password: string;
    age?: number; // Le "?" signifie que ce champ est optionnel
    gender?: string;
    centre_d_interet: string[]; 
    mentalHealthHistory: string[]; //tableau d'état menatl
    points: number;
    recompenses: string[]; 
    dernierQuizDate: Date;
  
    constructor(
      id: number,
      name: string,
      email: string,
      password: string,
      age?: number,
      gender?: string,
      centre_d_interet: string[] = [],
      mentalHealthHistory: string[] = [], // //tableau d'état menatl
      points: number = 0,
      recompenses: string[] = [],
      dernierQuizDate: Date = new Date()
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.age = age;
      this.gender = gender;
      this.centre_d_interet = centre_d_interet;
      this.mentalHealthHistory = mentalHealthHistory;
      this.points = points;
      this.recompenses = recompenses;
      this.dernierQuizDate = dernierQuizDate;
    }
  }
  
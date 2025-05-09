export default class User {
  constructor(name, email, password, age, gender, interests, mentalHistory, points, rewards, lastQuizDate) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.age = age;
    this.gender = gender;
    this.interests = interests || [];
    this.mentalHistory = mentalHistory || [];
    this.points = points || 0;
    this.rewards = rewards || [];
    this.lastQuizDate = lastQuizDate || new Date();
  }
}

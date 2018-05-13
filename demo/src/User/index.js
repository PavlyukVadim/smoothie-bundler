class User {
  constructor(name, age, phone) {
    this.name = name
    this.age = age
    this.phone = phone
  }

  getName() {
    return this.name
  }

  getYearOfBirth() {
    const today = new Date()
    const currentYear = today.getFullYear()
    return currentYear - this.age
  }
}

export default User

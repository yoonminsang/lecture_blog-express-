import mysql from 'mysql2/promise';
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '383838',
  database: 'lectureBlog',
});
export default db;

import mysql from 'mysql2/promise';
import dbOption from '../config/db.json';
const db = mysql.createPool(dbOption);
export default db;

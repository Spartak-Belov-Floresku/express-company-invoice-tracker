const db = require("../db");

class dbInvoices{

    static async getAll(){
        try{
            
            const result = await db.query(`SELECT * FROM invoices`);

            return result;

        }catch(err){

            return err;

        }
    }

    static async getInvoice(id){

        try{

            const result = await db.query(`SELECT * FROM invoices i JOIN companies c ON i.comp_code = c.code WHERE id = $1`, [id]);

            return result;

        }catch(err){
            
            return err;

        }

    }

    static async createInvoice(comp_code, amt){

        try {

            const result = await db.query(
                `INSERT INTO invoices (comp_code, amt) 
                VALUES ($1, $2) 
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                [comp_code, amt]
            );
        
            return result;
      
        } catch (err) {
      
            return err;
      
        }

    }

    static async updateInvoice(amt, id){

        try {

            const result = await db.query(
                `UPDATE invoices 
                SET amt=$1
                WHERE id = $2
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                [amt, id]
            );
        
            return result;
      
        } catch (err) {

            return err;
      
        }
        
    }

    static async deleteInvoice(id){

        try {

            const result = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [id]);
        
            return result;
      
        } catch (err) {

            return err;
      
        }
        
    }



}

module.exports = dbInvoices;
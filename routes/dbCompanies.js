const db = require("../db");

class dbCompanies{

    static async getAll(){
        try{
            
            const result = await db.query(`SELECT * FROM companies`);

            return result;

        }catch(err){

            return err;

        }
    }

    static async getCompany(company){

        try{

            const result = await db.query(`SELECT * FROM companies WHERE code = $1`, [company]);

            return result;

        }catch(err){
            
            return err;

        }

    }

    static async createCompany(code, name, description){

        try {

            const result = await db.query(
                `INSERT INTO companies (code, name, description) 
                VALUES ($1, $2, $3) 
                RETURNING code, name, description`,
                [code, name, description]
            );
        
            return result;
      
        } catch (err) {
      
            return err;
      
        }

    }

    static async updateCompany(code, name, description){

        try {

            const result = await db.query(
                `UPDATE companies 
                SET name=$1, description=$2
                WHERE code = $3
                RETURNING code, name, description`,
                [name, description, code]
            );
        
            return result;
      
        } catch (err) {

            return err;
      
        }
        
    }

    static async deleteCompany(code){

        try {

            const result = await db.query(`DELETE FROM companies WHERE code = $1 RETURNING code`, [code]);
        
            return result;
      
        } catch (err) {

            return err;
      
        }
        
    }



}

module.exports = dbCompanies;
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

            let result = await db.query(`SELECT * FROM companies AS c JOIN invoices as i ON i.comp_code = c.code WHERE code = $1`, [company]);

            if(result.rows.length != 0){

                let {code, name, description} = result.rows[0];

                let invoices = result.rows.map(r => {return {"id":r.id, "amt":r.amt, "paid":r.paid, "add_date":r.add_date, "paid_date":r.paid_date}});

                result = {code, name, description, invoices};

            }else{

                result = {status: 404}

            }

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
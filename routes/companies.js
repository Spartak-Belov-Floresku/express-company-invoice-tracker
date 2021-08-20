const express = require("express");
const router = new express.Router();


const dbCompanies = require("./dbCompanies");


router.get("/", async (req, res, next) => {

  const result = await dbCompanies.getAll();

  if(!result.message){

    return result.rows.length? res.json({companies : result.rows}): res.status(404).json({companies : `db is empty`});

  }

  return next(result.message);

});


router.get("/:code", async (req, res, next) => {
   
    const result = await dbCompanies.getCompany(req.params.code);

    if(result.status != 404){

      return res.json({company: result});

    }else if(result.status == 404){

      return res.status(404).json({company :  `There is no company with code of ${req.params.code}`});

    }

    return next(result.message);

});

router.post("/", async (req, res, next) => {
  
    const result = await dbCompanies.createCompany(req.body.code, req.body.name, req.body.description);

    if(!result.message){

      return res.status(201).json({company: result.rows[0]});

    }

    return next(result.message);

  });


  router.put("/:code", async (req, res, next) => {
    
      if ("code" in req.body) {

        return next({"Not allowed": 400});

      }

      const result = await dbCompanies.updateCompany(req.params.code, req.body.name, req.body.description);

      if(!result.message){

        return (result.rows.length != 0)? res.json({ company: result.rows[0]}): next({message:`There is no company with code of ${req.params.code}`, status: 404});

      }

      return next(result.message);

  });

  router.delete("/:code", async (req, res, next) => {
   
    const result = await dbCompanies.deleteCompany(req.params.code);

    if(!result.message){

      return (result.rows.length != 0)? res.json({ status: "deleted"}): res.status(404).json({company : `There is no company with code of ${req.params.code}`});

    }

    return next(result.message);

  });



module.exports = router;
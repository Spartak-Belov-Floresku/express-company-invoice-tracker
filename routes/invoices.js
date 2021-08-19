const express = require("express");
const router = new express.Router();


const dbInvoices = require("./dbInvoices");


router.get("/", async (req, res, next) => {

  const result = await dbInvoices.getAll();

  if(!result.message){

    return result.rows.length? res.json({invoices :result.rows}): res.status(404).json({companies : `db is empty`});

  }

  return next(result.message);

});

router.get("/:id", async (req, res, next) => {

  const result = await dbInvoices.getInvoice(req.params.id);

  if(!result.message){

    return result.rows.length != 0? res.json({ invoice :result.rows[0]}): res.status(404).json({ invoice : `id ${req.params.id} does not exist`});

  }

  return next(result.message);

});

router.post("/", async (req, res, next) => {
   
  const result = await dbInvoices.createInvoice(req.body.comp_code, req.body.amt);

  if(!result.message){
    
    return res.status(201).json({invoice: result.rows[0]});  // 201 CREATED
    
  }
    
  return next(result.message);

});


  router.put("/:id", async (req, res, next) => {
   
    if ("id" in req.body) {

      return next({"Not allowed": 400});

    }
    const result = await dbInvoices.updateInvoice(req.body.amt, req.params.id);


    if(!result.message){
    
      return (result.rows.length != 0)? res.json({invoice: result.rows[0]}): res.status(404).json({invoice : `There is no invoice with id of ${req.params.id}`});
    
    }
    
    return next(result.message);

  });

  router.delete("/:id", async (req, res, next) => {

    const result = await dbInvoices.deleteInvoice(req.params.id);

    if(!result.message){
    
      return (result.rows.length != 0)? res.json({ status: "deleted" }): res.status(404).json({invoice : `There is no invoice with id of ${req.params.id}`});
    
    }
    
    return next(result.message);


  });



module.exports = router;
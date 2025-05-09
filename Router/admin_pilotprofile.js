/*admin realted*/
router.get('/pilotprofile',async(req,res)=>{
    res.render("pilotprofile")
})
router.get('/flightdetails',async(req,res)=>{
    res.render("flightdetails")
})
router.get('/scheduleflights',async(req,res)=>{
    res.render("scheduleflights")
})

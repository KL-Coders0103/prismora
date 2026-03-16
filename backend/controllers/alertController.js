const Alert = require("../models/Alert");
const { getIO } = require("../sockets/realtimeSocket");
const { logActivity } = require("../services/activityService");

exports.getAlerts = async (req,res)=>{

  try{

    const limit = Number(req.query.limit) || 50;

    const alerts = await Alert.find()
      .sort({ createdAt:-1 })
      .limit(limit);

    res.json(alerts);

  }catch(error){

    res.status(500).json({
      message:"Failed to fetch alerts"
    });

  }

};

exports.createAlert = async (req,res)=>{

  try{

    const { message,type,severity,source } = req.body;

    if(!message || message.length < 3){
      return res.status(400).json({
        message:"Valid alert message required"
      });
    }

    const allowedTypes = ["system","sales","ai"];

    if(type && !allowedTypes.includes(type)){
      return res.status(400).json({
        message:"Invalid alert type"
      });
    }

    const alert = await Alert.create({
      message,
      type,
      severity,
      source
    });

    const io = getIO();

    if(io){

      io.emit("alert",{
        id:alert._id,
        message:alert.message,
        type:alert.type,
        severity:alert.severity,
        createdAt:alert.createdAt
      });

    }

    await logActivity(
      req.user?.id || null,
      "create_alert",
      { message: message.substring(0,100) }
    );

    res.status(201).json(alert);

  }catch(error){

    console.error("CREATE ALERT ERROR:", error);

    res.status(500).json({
      message:"Failed to create alert"
    });

  }

};

exports.markAsRead = async (req,res)=>{

  try{

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead:true },
      { new:true }
    );

    if(!alert){
      return res.status(404).json({
        message:"Alert not found"
      });
    }

    await logActivity(
      req.user?.id || null,
      "alert_marked_read",
      { alertId:req.params.id }
    );

    res.json(alert);

  }catch(error){

    res.status(500).json({
      message:"Failed to update alert"
    });

  }

};

exports.deleteAlert = async (req,res)=>{

  try{

    const alert = await Alert.findByIdAndDelete(req.params.id);

    if(!alert){
      return res.status(404).json({
        message:"Alert not found"
      });
    }

    await logActivity(
      req.user?.id || null,
      "delete_alert",
      { alertId:req.params.id }
    );

    res.json({
      message:"Alert deleted successfully"
    });

  }catch(error){

    res.status(500).json({
      message:"Failed to delete alert"
    });

  }

};
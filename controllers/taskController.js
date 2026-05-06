const Task= require("../models/Task");

exports.createTask = async (req, res) =>{
    try {
        const {title, description} = req.body;

        const task = new Task({
            title,
            description,
            createdBy: req.user.id,
        });

        await task.save();
        res.json(task);

    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.getTasks = async (req, res) => {
    try {        
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const search = req.query.search || "";
    const status = req.query.status;

    const query = {
      createdBy: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(tasks);
    } catch (err) {
        res.status(500).send("Server Error");        
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({msg: "Task not found"});
    // 🔐 SECURITY CHECK
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    await task.save();

    res.json(task); // ✅ FIXED
    } catch (err) {
        res.status(500).send("Server Error");        
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({msg: "Task deleted"});
    } catch (err) {
        res.status(500).send("Server Error");     
        
    }
};
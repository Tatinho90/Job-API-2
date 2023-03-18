const Job = require("../models/Job")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors/index")

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({jobs, count: jobs.length0})
}

const getJob = async (req, res) => {
    const {user: {userId}, params:{id: jobId}} = req
    //same as const {userId} = req.user
    // const {id} = req.params
    const job = await Job.findOne({_id:jobId, createdBy:userId} )
    if (!job){
        throw new NotFoundError("This job ID doesn't exist")
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
    const {id: jobId} = req.params
    const {userId} = req.user
    const {company, position} = req.body 

    if(company === "" || position=== ""){
        throw new BadRequestError("Company or position field cannot be empty")
    }

    const job = await Job.findOneAndUpdate({
        //find the job I want to update (aka where these parameters match)
        _id:jobId, createdBy:userId},
        //what we want to update in the job
        req.body,
        {new:true, runValidators:true}
        )
    if (!job){
        throw new NotFoundError("job doesn't exist")
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
    const {id: jobId} = req.params
    const {userId} = req.user

    const job = await Job.findOneAndRemove({_id:jobId,createdBy:userId})

    if(!job){
        throw new NotFoundError("Job doesn't exist")
    }

    res.status(StatusCodes.OK).json({msg: `job with id: ${jobId} successfuly deleted`})
}


module.exports = {getAllJobs,
    getJob,
    createJob,
    updateJob, 
    deleteJob
}
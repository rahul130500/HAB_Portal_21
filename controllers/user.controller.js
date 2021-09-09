const Notice = require("../models/notice");
const Announcement = require("../models/announcement");
const AdminUpload = require("../models/adminUploads");
const Form = require("../models/form");
const Functionary = require("../models/functionary");
const Hostel = require("../models/hostel");
const Category = require("../models/category");
const Link = require("../models/link");
const Ordinance = require("../models/ordinance");
const About = require("../models/about");
const { ConnectionStates } = require("mongoose");
const fs = require("fs");

exports.getHome = async (req, res) => {
  let notices = await Notice.find({}).sort("-creation");
  let categories = await Category.find({});
  let announcements = await Announcement.find({}).sort("-creation");
  let links = await Link.find({}).sort("priority_number");
  let forms = await Form.find({}).sort("-creation");
  let uploads = await AdminUpload.find({});
  let ordinances = await Ordinance.find({});
  let aboutInfos = await About.find({}).sort("priority_number");
  let uploadImages = [];
  uploads.forEach((upload) => {
    uploadImages.push(`uploads/adminUploads/${upload.image}`);
  });

  let functionaries = await Functionary.find({}).sort("-priority");
  let hostels = await Hostel.find({});

  return res.render("home/index", {
    notices,
    announcements,
    uploads,
    forms,
    functionaries,
    hostels,
    uploadImages,
    aboutInfos,
    categories,
    links,
    ordinances,
  });
};

exports.getOneHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostel_id);
    const hostels = await Hostel.find({});

    // if (!hostel) {
    //   req.flash("error", "Cannot find hostel");
    //   return res.redirect("/");
    // }

    const members = hostel.management;
    members.sort((a, b) => (a.priority > b.priority ? 1 : -1));

    return res.render("home/hostels/hostel", { members, hostel, hostels });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/hab");
  }
};

exports.getOneLink = async (req, res) => {
  try {
    const linkid = req.params.link_id;
    const subid = req.params.sublink_id;
    const link = await Link.findById(linkid);
    console.log(link);
    var filepath;
    for (var i = 0; i < link.sublinks.length; i++) {
      if (link.sublinks[i].id == subid) {
        filepath = link.sublinks[i].url;
        break;
      }
    }
    console.log(filepath);
    const filePath1 = "uploads/link_pdf/" + filepath;
    fs.readFile(filePath1, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/hab");
  }
};

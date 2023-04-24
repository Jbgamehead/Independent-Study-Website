import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
    return (
        <div>
            <Navbar />
            <section id="about">
                <div className="container mt-4 px-5 pt-3">
                    <div className="row">
                        <div className="col-md-6">
                            <img src="./src/assets/about1.png" alt="About"
                                className="w-75 mt-5" />
                        </div>
                        <div className="col-md-6">
                            <h3 className="fs-5 mb-0">About Us</h3>
                            <h1 className="display-6 mb-2">Who <b>We</b> Are</h1>
                            <hr className="w-50" />
                            <p className="lead mb-4">Who are we? We’re just like you.
                                After a long day at work, upon returning home, there
                                is even more work: THE CLEANING. Not to mention the grocery
                                shopping to do; the laundry basket spilling over the top,
                                the kids needing help with homework, and don’t forget…..
                                dinner for the family. We know because we’ve been there.
                                It can be really overwhelming that you just want to drop
                                everything and take a vacation right there and then, just to
                                get away from it all. Who really wants to spend the week nights,
                                weekends or days off cleaning and doing chores?</p>
                            <NavLink to="/service" className="btn btn-primary rounded-pill px-4 py-2">Get Started</NavLink>
                            <NavLink to="/contact" className="btn btn-outline-primary rounded-pill px-4 py-2 ms-2">Contact Us</NavLink>
                        </div>
                    </div>
                </div>
            </section>
            <div className="mt-4 px-5 pt-3"></div>
            <Footer />
        </div>
    );
}

export default About;
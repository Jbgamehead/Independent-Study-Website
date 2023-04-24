import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Contact = () => {




    return (
        <div>
            <Navbar />
            <section id="contact">
                <div className="container mt-4 px-5 pt-3">
                    <div className="row mb-5">
                        <div className="col-12">
                            <h3 className="fs-5 text-center mb-0">Contact Us</h3>
                            <h1 className="display-6 text-center mb-4">
                                Have Some <b>Questions?</b>
                            </h1>
                            <hr className="w-25 mx-auto" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <img src="./src/assets/contact.png" alt="Contact" className="w-75" />
                        </div>
                        <div className="col-md-6">
                            <form >
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Your Name</label>
                                    <input type="text" class="form-control" id="clientname" placeholder="Joe Smoe"
                                        name="clientname" />
                                </div>
                                <div class="mb-3">
                                    <label for="exampleFormControlInput1" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
                                        name="clientemail" />
                                </div>
                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label">Your Message</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="5"
                                        name="message"  ></textarea>
                                </div>
                                <button type="submit" className="btn btn-outline-primary rounded-pill px-4">Send Message<i className="fa fa-paper-plane ms-2"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <div className="mt-4 px-5 pt-3"></div>
            <Footer />
        </div>
    );
}

export default Contact;
import React from "react";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Carousel from 'react-bootstrap/Carousel';

const Home = () => {
    return (
        <div>
            <Navbar />

            <Carousel>
                <Carousel.Item>
                    <img
                        src="./src/assets/nice.png"
                        height="760"
                        width="1700"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <div className="justify-content-center md-5">
                            <NavLink to="/contact" className="btn btn-light me-4 rounded-pill px-4 py-2">Get Quote</NavLink>
                            <NavLink to="/service" className="btn btn-outline-light rounded-pill px-4 py-2">Our Services</NavLink>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="./src/assets/lilgal.png"
                        alt="First slide"
                    />

                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>

                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <section id="home">
                {/*<div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <h1 className="display-4 fw-bolder mb-4 text-center text-white">The Best Cleaning Company in NJ</h1>
                            <p className="lead text-center text-white fs-4 mb-5">Creating a Lifetime of Memories One Cleaning at a Time</p>
                            <div className="buttons d-flex justify-content-center">
                                <NavLink to="/contact" className="btn btn-light me-4 rounded-pill px-4 py-2">Get Quote</NavLink>
                                <NavLink to="/service" className="btn btn-outline-light rounded-pill px-4 py-2">Our Services</NavLink>

                            </div>
                        </div>
                    </div>
    </div>*/}
            </section>
            <Footer />
        </div>
    );
}

export default Home;
import React from 'react';
import { HomeNavigationBar } from "../../";
import {Link} from "react-router-dom";
import Logo from "../../images/testimonial-profile-picture.jpg";

export default function Home() {
    return (
        <div>
            <HomeNavigationBar />
            <main>
                <section className="hero">
                    <div className="container">
                        <div className="home-message">
                            <h3>A bank made just for</h3>
                            <h1>Students</h1>
                            <p>
                                StuBank is a one-of-a-kind banking platform tailored specifically towards students to
                                help them manage their finances throughout university. We offer a range of services to
                                help students spend and manage their money in multiple currencies, all in one place.
                                Get started today and see how StuBank can revolutionise your day-to-day banking.
                            </p>
                            <Link to="/register" className="btn" type="submit">Get started</Link>
                        </div>
                    </div>
                </section>

                <section className="experience-banking">
                    <div className="container">
                        <div className="title-heading">
                            <h3>Experience banking</h3>
                            <h1>like never before</h1>
                        </div>

                        <div className="activities-grid">
                            <div className="activities-grid-item saving-account">
                                <i className="icon ion-ios-lock"/>
                                <h1>Current Account</h1>
                                <p>Manage your finances with our free current account which offers no monthly fee
                                    and no spending limit. Send money to other accounts, exchange currencies and manage
                                    your finances like never before</p>
                            </div>
                            <div className="activities-grid-item currency">
                                <i className="icon ion-ios-planet"/>
                                <h1>Currency Exchange</h1>
                                <p>Exchange a range of currencies such as Pound (GBP), Euro (EUR) or Dollar (USD) for a
                                    stress free international experience. With our multicurrency account you can have
                                    full control over your spending when you travel in UK or abroad.</p>
                            </div>
                            <div className="activities-grid-item overdraft">
                                <i className="icon ion-ios-card"/>
                                <h1>Virtual Card</h1>
                                <p>With our secure virtual card you can pay for your online shopping with ease.
                                    Generating a new card which is tied up to your account takes seconds which is very
                                    useful if you want to secure your bank details when shopping online.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="testimonials">
                    <div className="container">
                        <div className="testimonial">
                            <div className="testimonial-text-box">
                                <p>Best banking platform for students. Has everything I need.</p>

                                <i className="icon ion-md-quote"/>
                            </div>
                            <div className="testimonial-customer">
                                <img src={Logo} alt=""/>
                                <h1>Lucas H.</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="begin-banking">
                    <div className="container">
                        <div className="title-heading">
                            <h2>Take charge of your finances and switch to</h2>
                            <h1>StuBank PLC</h1>
                        </div>
                        <div className="banking-grid">
                            <p>Think StuBank is for you? Join today with our quick and simple application process to
                                help you have full control over your finances today. Click the button below to get
                                started.</p>
                        </div>
                        <Link style={{marginLeft: 350}} className="btn1" to="/register">Make an account now</Link>
                        <div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
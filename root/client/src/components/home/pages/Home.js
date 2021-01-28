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
                            <div className="activities-grid-item currency">
                                <i className="icon ion-ios-planet"/>
                                <h1>Currency Exchange</h1>
                                <p>Manage your finaces in a range of currencies (GBP, EUR, USD) for a stress free
                                international experience. Have full control over your spending, even outside the UK</p>
                            </div>
                            <div className="activities-grid-item overdraft">
                                <i className="icon ion-ios-card"/>
                                <h1>Overdraft</h1>
                                <p>Maintenence loan not paid into your account yet? Got rent and/or bills to pay? Worry
                                not as StuBank offers an interest free overdraft to all its customers.
                                Checking if you're eligible for an overdraft won't affect your credit score and
                                there are no charges to full repaying an overdraft before graduation.</p>
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
                            <div className="banking-grid">
                                <p>Think StuBank is for you? Join today with our quick and simple application process to
                                    help you have full control over your finances today. Click the button below to get
                                    started.</p>
                            </div>
                            <p>StuBank plc. Registered in England No. XXXXXXXX.
                                Registered Office: Urban Sciences Building
                                Newcastle University, NE4 5TG, United Kingdom.
                                Authorised by the Prudential Regulation Authority and regulated by the Financial
                                Conduct Authority and the Prudential Regulation Authority under registration number
                                XXXXXX.
                            </p>
                        </div>
                        <Link className="btn1" to="/register">Make an account now</Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
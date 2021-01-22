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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia elementum
                                suscipit.
                                Vivamus faucibus arcu ut pulvinar imperdiet. Aliquam et ullamcorper augue. Quisque
                                dictum in velit sed mattis.
                                Proin tempor, urna eu euismod molestie, ante magna imperdiet massa, eget aliquet
                                tellus mi at felis.
                                Morbi mollis rhoncus massa et commodo. Nam magna mi, egestas ac arcu sit amet,
                                dignissim facilisis felis.
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>

                        <div className="activities-grid">
                            <div className="activities-grid-item saving-account">
                                <i className="icon ion-ios-lock"/>
                                <h1>Saving Accounts</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod felis nec
                                    ligula iaculis, et scelerisque erat tempor. Quisque mollis tincidunt commodo.
                                    Curabitur aliquam, leo a aliquam accumsan, erat lorem imperdiet ex,
                                    in scelerisque enim ipsum non ipsum. Mauris non diam ac risus lacinia
                                    sollicitudin.</p>
                            </div>
                            <div className="activities-grid-item currency">
                                <i className="icon ion-ios-planet"/>
                                <h1>Currency Exchange</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod felis nec
                                    ligula iaculis, et scelerisque erat tempor. Quisque mollis tincidunt commodo.
                                    Curabitur aliquam, leo a aliquam accumsan, erat lorem imperdiet ex,
                                    in scelerisque enim ipsum non ipsum. Mauris non diam ac risus lacinia
                                    sollicitudin.</p>
                            </div>
                            <div className="activities-grid-item overdraft">
                                <i className="icon ion-ios-card"/>
                                <h1>Overdraft</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod felis nec
                                    ligula iaculis, et scelerisque erat tempor. Quisque mollis tincidunt commodo.
                                    Curabitur aliquam, leo a aliquam accumsan, erat lorem imperdiet ex,
                                    in scelerisque enim ipsum non ipsum. Mauris non diam ac risus lacinia
                                    sollicitudin.</p>
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="banking-grid">
                            <div className="banking-grid-item">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod felis nec
                                    ligula iaculis,
                                    et scelerisque erat tempor. Quisque mollis tincidunt commodo. Curabitur aliquam,
                                    leo a aliquam accumsan, erat lorem imperdiet ex,
                                    in scelerisque enim ipsum non ipsum.Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.</p>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod felis nec
                                ligula iaculis,
                                et scelerisque erat tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Nunc euismod felis nec ligula iaculis,
                                et scelerisque erat tempor. Quisque mollis tincidunt commodo. Curabitur aliquam, leo
                                a aliquam accumsan, erat lorem imperdiet ex,
                                in scelerisque enim ipsum non ipsum.</p>
                        </div>
                        <Link className="btn1" to="/register">Make an account now</Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
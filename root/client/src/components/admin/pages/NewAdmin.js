import React from "react";
import { AdminNavigationBar } from "../../";

export default function NewAdmin () {
    return (
        <div className="top-bar">
            <AdminNavigationBar />
            <div className="main-background">
                <div className="small-bank-box">
                    <h1>New Admin</h1>
                </div>
            </div>
        </div>
    )
}
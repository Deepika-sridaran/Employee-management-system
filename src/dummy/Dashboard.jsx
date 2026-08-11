import MainLayout from "../layouts/MainLayout.jsx";
import "./Dashboard.css";

function Dashboard(){
    return(
        <MainLayout>
            <div className="dashboard">
                {/* Dashboard Header*/}
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome Pradeep Kumar S</p>
                    </div>
                    <div className="dashboard-data">
                        August 2026
                        </div>
                    </div>
                    <div className="dashboard-grid">

                    {/* My Calendar */}
                    <div className="dashboard-card calendar-card">

                        <div className="card-header">
                            <h3>📅 MY CALENDAR</h3>
                            <span>⌄</span>
                        </div>

                        <div className="calendar-month">
                            <strong>August 2026</strong>
                        </div>

                        <div className="calendar">

                            <div className="calendar-days">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>

                            <div className="calendar-dates">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>

                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span className="today">10</span>
                                <span>11</span>
                                <span>12</span>
                                <span>13</span>
                                <span>14</span>
                                <span>15</span>
                                <span>16</span>
                                <span>17</span>
                                <span>18</span>
                                <span>19</span>
                                <span>20</span>
                                <span>21</span>
                                <span>22</span>
                                <span>23</span>
                                <span>24</span>
                                <span>25</span>
                                <span>26</span>
                                <span>27</span>
                                <span>28</span>
                                <span>29</span>
                                <span>30</span>
                                <span>31</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card holiday-card">
                        <div className="card-header">
                            <h3>🎉 UPCOMING HOLIDAY</h3>
                            <span>⌄</span>
                        </div>
                        <div className="holiday-content">
                            <div className="holiday-icon">
                                🎊
                            </div>
                            <div>
                                <h2>Independence Day</h2>
                                <p>15 August 2026</p>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card balance-card">

                        <div className="card-header">
                            <h3>🌴 LEAVE BALANCE</h3>
                            <span>⌄</span>
                        </div>

                        <div className="leave-balance">
                            <div className="leave-item">
                                <span>Casual Leave</span>
                                <strong>8</strong>
                            </div>
                            <div className="leave-item">
                                <span>Sick Leave</span>
                                <strong>6</strong>
                            </div>
                            <div className="leave-item">
                                <span>Earned Leave</span>
                                <strong>12</strong>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="dashboard-bottom-grid">

                    <div className="dashboard-card leave-summary">
                        <div className="card-header">
                            <h3>📊 LEAVE SUMMARY</h3>
                            <span>⌄</span>
                        </div>
                        <div className="summary-container">
                            <div className="summary-box">
                                <span>Total Leave</span>
                                <strong>26</strong>
                            </div>
                            <div className="summary-box approved">
                                <span>Approved</span>
                                <strong>8</strong>
                            </div>
                            <div className="summary-box pending">
                                <span>Pending</span>
                                <strong>2</strong>
                            </div>
                            <div className="summary-box rejected">
                                <span>Rejected</span>
                                <strong>1</strong>
                            </div>
                        </div>
                    </div>

                     <div className="dashboard-card employee-summary">

                        <div className="card-header">
                            <h3>👥 EMPLOYEE SUMMARY</h3>
                            <span>⌄</span>
                        </div>

                        <div className="employee-stats">
                            <div>
                                <span>Total Employees</span>
                                <strong>16</strong>
                            </div>
                            <div>
                                <span>Active Employees</span>
                                <strong>14</strong>
                            </div>
                            <div>
                                <span>On Leave</span>
                                <strong>2</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card recent-leaves">

                    <div className="card-header">
                        <h3>📋 RECENT LEAVE REQUESTS</h3>
                        <span>⌄</span>
                    </div>

                    <table>

                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td>Pradeep Kumar</td>
                                <td>Casual Leave</td>
                                <td>18 Aug 2026</td>
                                <td>19 Aug 2026</td>
                                <td>
                                    <span className="status approved-status">
                                        Approved
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td>Monisha</td>
                                <td>Sick Leave</td>
                                <td>20 Aug 2026</td>
                                <td>20 Aug 2026</td>
                                <td>
                                    <span className="status pending-status">
                                        Pending
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                 <td>Priya</td>
                                <td>Earned Leave</td>
                                <td>25 Aug 2026</td>
                                <td>27 Aug 2026</td>
                                <td>
                                    <span className="status rejected-status">
                                        Rejected
                                    </span>
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>
    );
}

export default Dashboard;

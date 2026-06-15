import React, { useEffect, useState } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";

import { db } from "../../services/firebase";

import { useTheme } from "../../context/ThemeContext";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

import Loader from "../../components/common/Loader/Loader";
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#6C5CE7",
];

export default function Dashboard() {


  const { user } = useAuth();

  // firebase states
  const [notes, setNotes] = useState([]);

 

  // DARK MODE
  const { darkMode } = useTheme();

  // LOADING
  const [loading, setLoading] = useState(true);

  // realtime firebase fetch
  useEffect(() => {
    if (!user) {
      return;
    }

    const uid = user.uid;
    // notes query
    const notesQuery = query(

      collection(db, "notes"),

      where(
        "userId",
        "==",
        uid
      )

    );

   

    // realtime notes
    const unsubscribeNotes =
      onSnapshot(notesQuery, (snapshot) => {

        const notesData =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setNotes(notesData);
    setLoading(false);

      });

       

    return () => {

      unsubscribeNotes();
    

    };

  }, [user]);

  // dashboard counts

// Active notes only
const totalNotes = notes.filter(
  (note) => !note.deleted && !note.archived
).length;

// Favorites from active notes
const favoriteNotes = notes.filter(
  (note) =>
    note.favorite &&
    !note.deleted &&
    !note.archived
).length;

// Pinned from active notes
const pinnedNotes = notes.filter(
  (note) =>
    note.pinned &&
    !note.deleted &&
    !note.archived
).length;

// Trash count
const trashCount = notes.filter(
  (note) => note.deleted === true
).length;

// Archive count
const archiveCount = notes.filter(
  (note) => note.archived === true
).length;

  const recentNotes = [...notes]
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  // category chart
  const categories = [
    "Personal",
    "Work",
    "Study",
    "Ideas",
  ];

  const categoryData = categories.map(
    (category) => ({
      name: category,
      value: notes.filter(
        (note) =>
          note.category === category
      ).length,
    })
  );



  // weekly chart data
  const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const weeklyData = weekDays.map((day) => {

    const count = notes.filter((note) => {

      if (!note.createdAt) return false;

      const date =
        note.createdAt?.seconds
          ? new Date(
            note.createdAt.seconds * 1000
          )
          : new Date(note.createdAt);

      return (
        weekDays[date.getDay()] === day
      );

    }).length;

    return {
      day,
      notes: count,
    };

  });

  // daily chart data
  const lastFiveDays = [...Array(5)]
    .map((_, index) => {

      const date = new Date();

      date.setDate(
        date.getDate() - (4 - index)
      );

      return date;

    });

  const dailyData = lastFiveDays.map(
    (date) => {

      const formattedDay =
        date.toLocaleDateString("en-US", {
          weekday: "short",
        });

      const count = notes.filter((note) => {

        if (!note.createdAt)
          return false;

        const noteDate =
          note.createdAt?.seconds
            ? new Date(
              note.createdAt.seconds * 1000
            )
            : new Date(note.createdAt);

        return (
          noteDate.toDateString() ===
          date.toDateString()
        );

      }).length;

      return {
        day: formattedDay,
        notes: count,
      };

    }
  );

  if (loading) {
  return <Loader text="Loading Dashboard..." />;
}

  return (

    <div
      className="container-fluid py-4 px-3"
      style={{
        minHeight: "100vh",
        background: darkMode
  ? "#1e293b"
  : "white",
        color: darkMode
          ? "white"
          : "#111827",
      }}
    >

      {/* heading */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            📊 Dashboard
          </h2>

          <p
  className="m-0"
  style={{
    color: darkMode
      ? "#cbd5e1"
      : "#6b7280",
  }}
>
  Welcome to your notes analytics
</p>
           

        </div>

      </div>

      {/* top cards */}

      <div className="row g-4 mb-4">

        {[
          {
            title: "Total Notes",
            value: totalNotes,
            icon: "📝",
          },

          {
            title: "Favorites",
            value: favoriteNotes,
            icon: "⭐",
          },

          {
            title: "Pinned",
            value: pinnedNotes,
            icon: "📌",
          },

          {
  title: "Trash",
  value: trashCount,
  icon: "🗑",
},

{
  title: "Archived",
  value: archiveCount,
  icon: "📥",
},

        ].map((item, index) => (

          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-2"
            key={item.title}
          >

            <div
              className="p-4 shadow-lg border-0 h-100"
              style={{
                borderRadius: "20px",
                background: darkMode
                  ? "#1e293b"
                  : "white",
              }}
            >

              <div className="d-flex justify-content-between align-items-center">

                <div>

                 <h6
  style={{
    color: darkMode
      ? "#cbd5e1"
      : "#6b7280",
  }}
>
  {item.title}
</h6>

                  <h2 className="fw-bold">
                    {item.value}
                  </h2>

                </div>

                <div
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  {item.icon}
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* charts */}

      <div className="row g-4">

        {/* pie chart */}

        <div className="col-lg-6">

          <div
            className="shadow-lg p-4 h-100"
            style={{
              borderRadius: "20px",
              background: darkMode
                ? "#1e293b"
                : "white",
            }}
          >

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h4 className="fw-bold">
                📊 Categories
              </h4>

              <span className="badge bg-primary">
                {notes.length} Notes
              </span>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={5}
                  label
                >

                  {categoryData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                          index %
                          COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#1e293b"
                      : "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    color: darkMode
                      ? "#ffffff"
                      : "#000000",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    color: darkMode ? "#fff" : "#000",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* line chart */}

        <div className="col-lg-6">

          <div
            className="shadow-lg p-4 h-100"
            style={{
              borderRadius: "20px",
              background: darkMode
                ? "#1e293b"
                : "white",
            }}
          >

            <h4 className="fw-bold mb-4">
              📈 Weekly Productivity
            </h4>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart data={weeklyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#475569" : "#d1d5db"}
                />

                <XAxis
                  dataKey="day"
                  stroke={darkMode ? "#fff" : "#000"}
                />

                <YAxis
                  stroke={darkMode ? "#fff" : "#000"}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#1e293b"
                      : "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    color: darkMode
                      ? "#ffffff"
                      : "#000000",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="notes"
                  stroke="#8B5CF6"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* bar chart */}

        <div className="col-12">

          <div
            className="shadow-lg p-4"
            style={{
              borderRadius: "20px",
              background: darkMode
                ? "#1e293b"
                : "white",
            }}
          >

            <h4 className="fw-bold mb-4">
              📅 Notes Per Day
            </h4>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart data={dailyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#475569" : "#d1d5db"}
                />

                <XAxis
                  dataKey="day"
                  stroke={darkMode ? "#fff" : "#000"}
                />

                <YAxis
                  stroke={darkMode ? "#fff" : "#000"}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode
                      ? "#1e293b"
                      : "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    color: darkMode
                      ? "#ffffff"
                      : "#000000",
                  }}
                />

                <Bar
                  dataKey="notes"
                  fill="#14B8A6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* recent notes */}

      <div className="col-12 mt-4">

        <div
          className="shadow-lg p-4"
          style={{
            borderRadius: "20px",
            background: darkMode
              ? "#1e293b"
              : "white",
          }}
        >

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h4 className="fw-bold">
              📝 Recent Notes
            </h4>

            <span className="badge bg-primary">
              {recentNotes.length} Recent
            </span>

          </div>

          {
            recentNotes.length === 0 ? (

              <p
                className="m-0"
                style={{
                  color: darkMode
                    ? "#cbd5e1"
                    : "#6b7280",
                }}
              >
                No recent notes found
              </p>

            ) : (

              recentNotes.map((note) => (

                <div
                  key={note.id}
                  className="d-flex justify-content-between align-items-center p-3 mb-3"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: darkMode
                      ? "#334155"
                      : "#f8fafc",
                  }}
                >

                  <div>

                    <h6 className="fw-bold m-0">

                      {
                        note.title ||
                        "Untitled Note"
                      }

                    </h6>

                   <small
  style={{
    color: darkMode
      ? "#cbd5e1"
      : "#6b7280",
  }}
>
  {note.category || "General"}
</small>

                  </div>

                  <div className="d-flex align-items-center gap-3">

                    {
                      note.favorite && (
                        <span>
                          ⭐
                        </span>
                      )
                    }

                    {
                      note.pinned && (
                        <span>
                          📌
                        </span>
                      )
                    }

                  </div>

                </div>

              ))

            )
          }

        </div>

      </div>

    </div>

  );

}
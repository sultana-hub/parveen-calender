
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { databases, ID } from "../appwrite/Appwrite";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link as LinkIcon } from "@mui/icons-material";

import { format } from "date-fns"; // Import date-fns for formatting

const fetchEvents = async () => {
    try {
        const response = await databases.listDocuments(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_COLLECTION_ID
        );

        return response.documents.map((event) => ({
            id: event.$id,
            title: event.title,
            event_url: event.event_url,
            start: `${event.start_date}T${event.start_time}`,
            end: `${event.end_date}T${event.end_time}`,
            color: event.color || "#3788d8"
        }));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

const Calendar = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    // const [highlightedDates, setHighlightedDates] = useState(new Set());
    // const [events1, setEvents1] = useState([]);  // 👈 Fix: Ensure `events` starts as an array


    const [newEvent, setNewEvent] = useState({
        title: "",
        event_url: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        color: "#3788d8" // Default color
    });

    // Fetch events using React Query
    const { data: events = [], isLoading, isError } = useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
    });
    console.log("Event Data:", events);
    // Mutation for adding an event
    const addEventMutation = useMutation({
        mutationFn: async (event) => {
            return await databases.createDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID,
                ID.unique(),
                event
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["events"]);// Refresh the events
            alert("Event created successfully!");
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        }
    });

    // Mutation for updating an event
    const updateEventMutation = useMutation({
        mutationFn: async ({ eventId, updatedEvent }) => {
            return await databases.updateDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID,
                eventId,
                updatedEvent
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["events"]);// Refresh the events
            alert("Event updated successfully!");
            setOpen(false);
            setEditMode(false);
            setSelectedEventId(null);
        },
        onError: (error) => {
            console.error("Error updating event:", error);
            alert("Failed to update event.");
        }
    });

    //mutation for deleting an event
    const deleteEventMutation = useMutation({
        mutationFn: async (eventId) => {
            return await databases.deleteDocument(
                process.env.REACT_APP_APPWRITE_DATABASE_ID,
                process.env.REACT_APP_APPWRITE_COLLECTION_ID,
                eventId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["events"]); // Refresh the events
            alert("Event deleted successfully!");
        },
        onError: (error) => {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        },
    });

    //delete function 
    const handleDeleteEvent = (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            deleteEventMutation.mutate(eventId);
        }
    };



    // Handle selecting a date to add an event
    const handleDateSelect = (selectInfo) => {
        setNewEvent({
            title: "",
            event_url: "",
            start_date: selectInfo.startStr.split("T")[0],
            start_time: "12:00",
            end_date: selectInfo.startStr.split("T")[0],
            end_time: "13:00",
            color: "#3788d8"
        });
        setEditMode(false);
        setOpen(true);
        setSelectedDate(selectInfo.startStr.split("T")[0]);

    };

    // const handleDateSelect = (selectInfo) => {
    //     const selectedDateStr = selectInfo.startStr.split("T")[0];

    //     let myEvent={
    //         title: "",
    //         event_url: "",
    //         start_date: selectedDateStr,
    //         start_time: "12:00",
    //         end_date: selectedDateStr,
    //         end_time: "13:00",
    //         color: "#3788d8"
    //     };
    //     setEvents1((prev) => [...prev, myEvent])
    //     setEditMode(false);
    //     setOpen(true);
    //     setSelectedDate(selectedDateStr);

    //     // setHighlightedDates((prev) => new Set([...prev, selectedDateStr]));
    // };





    // info: This parameter represents the event object passed by FullCalendar when an event is clicked
    const handleEventClick = (info) => {
        const eventProps = info.event.extendedProps || {}; // Ensure `extendedProps` is defined

        // Check if start and end exist before processing
        const startDateTime = info.event.startStr ? info.event.startStr.split("T") : ["", "12:00"];
        const endDateTime = info.event.endStr ? info.event.endStr.split("T") : ["", "13:00"];

        setEditMode(true);
        setSelectedEventId(info.event.id);
        setNewEvent({
            title: info.event.title || "",
            event_url: eventProps.event_url || "", // Ensure fallback for undefined values
            start_date: startDateTime[0] || "",
            start_time: startDateTime[1]?.slice(0, 5) || "12:00",
            end_date: endDateTime[0] || "",
            end_time: endDateTime[1]?.slice(0, 5) || "13:00",
            color: eventProps.color || "#3788d8"
        });

        setOpen(true);
    };


    // Handle form submission (Add or Update)
    const handleSubmit = () => {
        if (!newEvent.title || !newEvent.start_date || !newEvent.start_time || !newEvent.end_date || !newEvent.end_time) {
            alert("Please fill all fields.");
            return;
        }

        // Ensure color is assigned a default if not set
        if (!newEvent.color) {
            newEvent.color = "#000000"; // Default black if no color is chosen
        }
        if (editMode && selectedEventId) {
            updateEventMutation.mutate({ eventId: selectedEventId, updatedEvent: newEvent });
        } else {
            addEventMutation.mutate(newEvent);
        }
    };


    // Highlight the selected date dynamically with user input
    // const highlightedEvent = selectedDate
    //     ? [{
    //         title: newEvent.title || "Selected Date", // Update dynamically
    //         start: selectedDate,
    //         backgroundColor: "#FF5733",
    //         display: "background"
    //     }]
    //     : [];







    return (
        <Box p={3}>
            {isLoading ? (
                <p>Loading events...</p>
            ) : isError ? (
                <p>Error fetching events.</p>
            ) : (
                <>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay", // ✅ Allows switching views
                        }}
                        selectable
                        select={handleDateSelect}
                        // dayCellDidMount={highlightSelectedDates} // Highlights selected dates
                        events={events}
                        eventClick={handleEventClick}
                        editable
                        eventBackgroundColor={(event) =>
                            selectedDate && event.start.includes(selectedDate) ? "#FF5733" : event.color
                        }
                        eventContent={(eventInfo) => (
                            <div style={{
                                backgroundColor: eventInfo.event.backgroundColor,
                                padding: "5px",
                                borderRadius: "5px",
                                color: "#fff"
                            }}>
                                {eventInfo.event.title}
                            </div>
                        )}
                 
                    />
                    <Typography sx={{ marginTop: "10px", fontWeight: "bold" }}>Upcoming Events</Typography>
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Title</strong></TableCell>
                                    <TableCell><strong>Event URL</strong></TableCell>
                                    <TableCell><strong>Start Date & Time</strong></TableCell>
                                    <TableCell><strong>End Date & Time</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell style={{ color: event?.color }}>{event.title}</TableCell>

                                        <TableCell>
                                            <a href={event.event_url} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon style={{ marginRight: 5 }} />{event.event_url}</a>
                                        </TableCell>
                                        {/* <TableCell>{event.start}</TableCell>
                                        <TableCell>{event.end}</TableCell> */}
                                        <TableCell>
                                            {event.start && event.start.match(/\d{4}-\d{2}-\d{2}/) && event.start.match(/\d{2}:\d{2}/)
                                                ? format(new Date(event.start.split('T')[0]), "EEEE, MMMM d, yyyy") + " at " + format(new Date(`1970-01-01T${event.start.split('T')[1]}`), "hh:mm a")
                                                : 'Invalid Start Date'}
                                        </TableCell>

                                        <TableCell>
                                            {event.end && event.end.match(/\d{4}-\d{2}-\d{2}/) && event.end.match(/\d{2}:\d{2}/)
                                                ? format(new Date(event.end.split('T')[0]), "EEEE, MMMM d, yyyy") + " at " + format(new Date(`1970-01-01T${event.end.split('T')[1]}`), "hh:mm a")
                                                : 'Invalid End Date'}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleEventClick({ event })} variant="contained" color="primary" size="small">Edit</Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* Add/Edit Event Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editMode ? "Edit Event" : "Add Event"}</DialogTitle>
                <DialogContent>
                    <TextField label="Event Title" fullWidth margin="dense" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                    <TextField label="Event URL"
                        fullWidth margin="dense"
                        value={newEvent.event_url}
                        onChange={(e) => setNewEvent({ ...newEvent, event_url: e.target.value })}
                        InputProps={{
                            startAdornment: <LinkIcon color="action" />, // 🔗 Icon as label
                        }}
                    />
                    <TextField type="date" fullWidth margin="dense" value={newEvent.start_date} onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })} />
                    <TextField type="time" fullWidth margin="dense" value={newEvent.start_time} onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} />
                    <TextField type="date" fullWidth margin="dense" value={newEvent.end_date} onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })} />
                    <TextField type="time" fullWidth margin="dense" value={newEvent.end_time} onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} />
                    <TextField
                        type="color"
                        fullWidth
                        margin="dense"
                        value={newEvent.color}
                        onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{editMode ? "Update Event" : "Add Event"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Calendar;


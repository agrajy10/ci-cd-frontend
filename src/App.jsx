import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, TextField, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import TaskList from "./TaskList";

export default function App() {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/tasks`
        );
        setTasks(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTitleError(!title);
    setDeadlineError(!deadline);

    if (!title || !deadline) {
      return;
    }

    try {
      const createdAt = new Date().toISOString();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/tasks/create-task`,
        {
          title,
          deadline: deadline.toISOString(),
          created_at: createdAt,
        }
      );
      const createdTask = response.data.data;
      setTasks([createdTask, ...tasks]);
      setTitle("");
      setDeadline(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      const completedAt = new Date().toISOString();
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/tasks/task/${taskId}/completed`,
        { completed_at: completedAt }
      );
      setTasks(tasks.map((task) => (task.id === taskId ? data.data : task)));
    } catch (error) {
      console.error("Error marking task complete:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          To do list
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
              error={titleError}
              helperText={titleError ? "Title is required" : ""}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disablePast
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ mb: 2 }} />
                )}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: deadlineError,
                    helperText: deadlineError ? "Deadline is required" : "",
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              disableElevation
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Add Task
            </Button>
          </Stack>
        </form>
        {tasks.length > 0 && (
          <TaskList tasks={tasks} handleMarkComplete={handleMarkComplete} />
        )}
      </Box>
    </Container>
  );
}

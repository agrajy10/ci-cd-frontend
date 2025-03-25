import React from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { format } from "date-fns";

const TaskList = ({ tasks, handleMarkComplete }) => {
  return (
    <List dense sx={{ mt: 4, border: "1px solid #efefef", borderRadius: 1 }}>
      {tasks.map((task, index) => (
        <ListItem sx={{ borderBottom: "1px solid #efefef" }} key={index}>
          <ListItemText
            primary={task.title}
            secondary={`Deadline: ${format(
              new Date(task.deadline),
              "Pp"
            )} | Created at: ${format(new Date(task.created_at), "Pp")}`}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleMarkComplete(task.id)}
            disabled={task.status === "completed"}
          >
            {task.status === "completed" ? "Completed" : "Mark Complete"}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;

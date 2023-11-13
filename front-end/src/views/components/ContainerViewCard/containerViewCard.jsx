
import { React, useState } from 'react';

import "./containerViewCard_style.css"
import submitIcon from "../../../img/submit-icon.png";
import trashIcon from "../../../img/trash-icon.png"

// import menuDotsIcon from "../../../img/menuDots-icon.png"
// import TaskCardNavbar from '../TaskCardNavbar/taskCardNavbar.jsx';
// import BooleanPopUp from '../BooleanPopUp/booleanPopUp.jsx';

function ContainerViewCard(props) {

    const [taskName, setTaskName] = useState(props.taskData.taskName);
    const [taskDescription, setTaskDescription] = useState(props.taskData.taskDescription);
    const [taskPriority, setTaskPriority] = useState(props.taskData.taskPriority);
    // const [confirmationDelete, setConfirmationDelete] = useState(false);

    const token = sessionStorage.getItem("token")
    // const userID = sessionStorage.getItem("userID");
    
    if (token === undefined || token === null) {
        window.location.href = "/";
    } 

    const handleEditTask = (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("userTask", [taskName, taskDescription, Number(taskPriority), props.taskData.taskKey]);
        
        // Enviando requisição para o back-end com token de acesso
        fetch("http://localhost:5000/updateTask", {
            method: 'POST',
            body: formdata,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Sessão expirada, favor se autenticar novamente");
                    window.location.href = "/";

                } else {

                    console.error("Error: " + response.status);
                }
            } else {
                
                return response.json();
            }
        })
        .then(data => {
            
            if (data.status) {
                props.setTrigger(false);
                props.refreshTasks();
                
                setTaskName("");
                setTaskDescription("");
                setTaskPriority("");    
            
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err))
    }

    const handleDeleteTask = (e) => {
        e.preventDefault()

        const formdata = new FormData();
        formdata.append("userTask", [props.taskData.taskKey]);
        
        // Enviando requisição para o back-end com token de acesso
        fetch("http://localhost:5000/deleteTask", {
            method: 'POST',
            body: formdata,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Sessão expirada, favor se autenticar novamente");
                    window.location.href = "/";

                } else {

                    console.error("Error: " + response.status);
                }
            } else {
                
                return response.json();
            }
        })
        .then(data => {
                        
            if (data.status) {
                props.setTrigger(false);
                props.refreshTasks();

                setTaskName("");
                setTaskDescription("");
                setTaskPriority("");

            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err))
    }

    let priorityColor = 'solid 2px ';
    
    if (Number(taskPriority) === 1) {
        priorityColor += 'red'
    
    } else if (Number(taskPriority) === 2) {
        priorityColor += 'orange';
    
    } else if (Number(taskPriority) === 3) {
        priorityColor += 'gold';
    
    } else if (Number(taskPriority) === 4) {
        priorityColor += 'lightgreen';
    } else {
        priorityColor += 'rgb(235, 232, 232)'
    }

    // const handleAnswer = (answer) => {
        // if (answer) {
        //     // handleDeleteTask()
        //     console.log("Sim")
        // } else {
        //     console.log("Não")
        // }
    // }

    const adjustTextareaHeight = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight) + 'px';
    };

    return (
        <div className='popUp-viewTask'>
            <div className='popUpContent-viewTask'>
                
                <button className='btnClose-viewTask' title='Fechar painel' onClick={() => props.setTrigger(false)}>X</button>

                {/* <img src={menuDotsIcon} className='taskCard-menu' alt="More actions icon" />

                <TaskCardNavbar /> */}

                {/* {confirmationDelete ? (
                        <BooleanPopUp 
                        message={"Tem certeza?"}
                        trueBtn={"Sim"}
                        falseBtn={"Não"}
                        setAnswer={handleAnswer}
                        // setTrigger={setConfirmat1ionDelete}
                        />
                    ) : ""} 
                */}
                
                <img src={trashIcon} onClick={handleDeleteTask} className='deleteTask-icon' alt="Delete task" />
                    
                <form className='taskForm-viewTask' onSubmit={handleEditTask}>

                    <div className="viewTaskForm-fields">
                        
                        <textarea 
                            name="taskName" 
                            className='taskName-textarea'
                            rows="1"
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder='Nome da tarefa'
                            onInput={adjustTextareaHeight}
                        >{taskName}</textarea>
                        
                        <textarea 
                            name="description" 
                            id="description-textarea" 
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            cols="10" 
                            rows="10" 
                            placeholder='Descrição'
                            ></textarea>
                        
                        <select 
                            required
                            name="priorityDropdown" 
                            id="priorityDropdown"
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            style={{border: priorityColor}} 
                            >
                            <option value="">Selecione a prioridade</option>
                            <option value="1">Prioridade 1</option>
                            <option value="2">Prioridade 2</option>
                            <option value="3">Prioridade 3</option>
                            <option value="4">Prioridade 4</option>
                        </select>
                    
                    </div>

                    <button type='submit' title='Editar tarefa'><img src={submitIcon} className='editTask-img' alt="Submit icon" /></button>

                </form>

            </div>
        </div>
    );
}

export default ContainerViewCard;

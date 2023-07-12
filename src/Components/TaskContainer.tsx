import { useEffect, useState } from "react"
import { TaskModel } from "../Models/TaskModel.type"
import { Task } from "./Task"
import axios from "axios"
import { BASEURL } from "../Utils/config"
import { Loading } from "./Loading"
import { Modal, Button, Form, Container, Row, Col, ButtonGroup, ToggleButton } from "react-bootstrap"


export const TaskContainer = () => {

    const editer: TaskModel = { _id: "", task: "", priority: "", status: "", createdAt: "", updatedAt: "" }

    const [isLoading, setLoading] = useState<Boolean>(false)
    const [data, setData] = useState<TaskModel[]>([])
    const [isOpenModel, setIsOpenModel] = useState(false)
    const [validated, setValidated] = useState(false)
    const [editerTask, setEditerTask] = useState<TaskModel>(editer)
    const [txtTask, setTxtTask] = useState("")

    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'High', value: '1' },
        { name: 'Medium', value: '2' },
        { name: 'Low', value: '3' },
    ];

    const closeModal = () => setIsOpenModel(false)
    const openModal = () => setIsOpenModel(true)

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
            if (editerTask._id) {
                updateTask()
            } else {
                postNewTask()
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get(`${BASEURL}/v1/task`)
                    .then(res => {
                        setLoading(true)
                        setData(res.data)
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);


    const postNewTask = () => {
        let res = radios.filter(e => e.value == radioValue);
        axios.post(`${BASEURL}/v1/task`, { task: txtTask, priority: res[0].name })
            .then(res => {
                let temp = [...data]
                temp.push(res.data)
                setEditerTask(editer)
                setTxtTask("")
                closeModal()
            })
            .catch(err => {
                console.log(err);
            })
    }

    const updateTask = () => {
        let res = radios.filter(e => e.value == radioValue);
        let editer: TaskModel = editerTask
        editer.task = txtTask
        editer.priority = res[0].name
        axios.patch(`${BASEURL}/v1/task/${editerTask._id}`, editer)
            .then(res => {
                setTxtTask("")
                setEditerTask(editer)
                closeModal()
            })
            .catch(err => {
                console.log(err);
            })
    }

    const removeTask = (index: any) => {
        const temp = [...data];
        temp.splice(index, 1);
        setData(temp);
    }

    const editTask = (index: any) => {
        const et: TaskModel = data[index]
        setTxtTask(et.task)
        let res = radios.filter(e => e.name == et.priority);
        setRadioValue(res[0].value)
        setEditerTask(et)
        openModal()
    }

    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTxtTask(e.target.value)
    }

    const handelAddNewTask = () => {
        setEditerTask(editer)
        openModal()
    }

    return <>
        <div className={`pt-5 container`} style={{ width: '40%', marginLeft: 'auto', marginRight: 'auto' }}>
            {
                isLoading ? <>
                    <div className={`row`}>
                        <div className={`col-md-4`}><h1>Task</h1></div>
                        <div className={`col-md-4`}></div>
                        <div className={`col-md-4`}><Button onClick={handelAddNewTask}>+Add Task</Button></div>
                    </div>
                    <div>
                        {
                            data?.map((e, i) => {
                                return (
                                    <Task key={i} task={e} index={i}
                                        handelRemoveTask={(index: any) => removeTask(index)}
                                        handelEditTask={(index) => editTask(index)}
                                    />
                                )
                            })
                        }
                    </div>
                </> : <Loading />
            }
        </div>
        <Modal show={isOpenModel} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>{editerTask._id ? 'Edit Task' : 'Add Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Task</Form.Label>
                        <Form.Control onChange={(e) => handelOnChange(e as any)} defaultValue={txtTask} required type="text" placeholder="send artical to editor" />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid artical.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Priority</Form.Label><br />
                        <Container style={{ width: '60%', float: 'left' }}>
                            <Row>
                                <ButtonGroup>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            style={{ marginLeft: '10px' }}
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={idx == 1 ? 'outline-danger' : (idx == 2) ? 'outline-warning' : 'outline-success'}
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Row>
                        </Container>
                    </Form.Group>
                    <br />
                    <Button style={{ float: 'right' }} variant="primary" type="submit">{
                        editerTask._id ? "Edit" : "Add"
                    }</Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>
}
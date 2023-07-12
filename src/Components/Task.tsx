import { TaskModel } from "../Models/TaskModel.type"
import { Modal, Button, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { BASEURL } from "../Utils/config";
import taskStyle from "../Style/task.module.css"

type taskProps = {
    task: TaskModel,
    index: Number,
    handelRemoveTask: (index: any) => void,
    handelEditTask: (index: any) => void
}

export const Task = (props: taskProps) => {

    const [isOpenDeleteModel, setIsOpenDeleteModel] = useState(false)

    const closeDeleteModal = () => setIsOpenDeleteModel(false)


    const openDeleteModal = () => setIsOpenDeleteModel(true)

    const deleteTask = () => {
        axios.delete(`${BASEURL}/v1/task/${props.task._id}`)
            .then(res => {
                closeDeleteModal()
                props.handelRemoveTask(props.index)
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <p>Task</p>
                                <p>{props.task.task}</p>
                            </Col>
                            <Col>
                                <p>Priority</p>
                                <p className={`text text-danger`}>{props.task.priority}</p>
                            </Col>
                            <Col><Button variant="secondary" style={{ fontSize: '8px' }}>{props.task.status}</Button></Col>
                            <Col>
                                <div className={`${taskStyle.progress}`} style={{
                                    background: `radial-gradient(closest-side, rgb(255, 255, 255) 79%, transparent 80% 100%),conic-gradient(rgb(0, 13, 255) ${props.task.status == 'To Do' ? '0%' : props.task.status == 'In Progress' ? '50%' : '100%'}, rgb(215, 215, 215) 0)`
                                }}></div>
                            </Col>
                            <Col><i className={`fa fa-edit text-primary`} onClick={() => props.handelEditTask(props.index)}></i></Col>
                            <Col><i className={`fa fa-trash-o text-danger`} onClick={openDeleteModal}></i></Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
            <br />
            <Modal show={isOpenDeleteModel} onHide={closeDeleteModal} centered>
                <Modal.Body>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col lg="6">
                                <p style={{ color: 'black', textAlign: 'center', fontSize: '20px' }} className={`text`}>Are you sure want to delete this task?</p>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col lg="6">
                                <Button onClick={() => deleteTask()}>Delete</Button>
                                <Button onClick={closeDeleteModal} style={{ marginLeft: '10px' }} variant="secondary">Cancel</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}
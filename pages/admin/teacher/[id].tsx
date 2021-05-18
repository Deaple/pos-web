import React, { useEffect, useState } from 'react'

import AdminBase from '../../../components/admin-base'
import { APIRoutes } from '../../../lib/api.routes'
import { Teacher } from '../../../models/teacher';
import { useRouter } from 'next/router'
import Link from 'next/link';
import * as Yup from 'yup'
import { ErrorMessage, Field, Formik } from 'formik'
import { toast } from 'react-nextjs-toast'
import API from '../../../lib/api.service';
import { APIResponse } from '../../../models/api-response';

export default function SaveTeacherLayout() {

    const router = useRouter();
    const api = API();

    const [teacher, setTeacher] = useState<Teacher>({
        name: "",
        about: "",
        email: "",
        phone: "",
        photo: "",
    });
    const [file, setFile] = useState<FileList>();
    const [localFileURL, setLocalFileURL] = useState<FileList>();

    const [newTeacher, setNewTeacher] = useState<boolean>(false);
    const [editingPhoto, setEditingPhoto] = useState<boolean>(false);


    useEffect(() => {

        const { id } = router.query;
        if (id) {
            if (id.toString() == "new") {
                setNewTeacher(true);
            } else {
                console.log(id);
                getTeacher(id.toString());
                setNewTeacher(false);
            }
        }

    }, [router.query]);

    const getTeacher = async (id: string) => {
        //Recupera o valor do banco de dados
        const result: APIResponse = await api.get(APIRoutes.TEACHER, { 'id': id });

        const teacher: Teacher = result.result;
        setTeacher(teacher);
    }

    const saveTeacher = async (values: Teacher) => {
        if(file[0]){
            api.postFile(APIRoutes.TEACHER, values, file[0]);
        }else{
            api.postFile(APIRoutes.TEACHER, values, null);
        }
    };

    const onSubmit = async (values, actions) => {
        try {
            actions.setSubmitting(true);
            await saveTeacher(values);
        } catch (error) {
            console.error(error);
            actions.setSubmitting(false);
        }
    }
    const editPhoto = () =>{
        
        setFile(undefined);
        setEditingPhoto(true);
    }


    return (
        <AdminBase>
            <div className="row mb-3">
                <div className="col-12 text-right">
                    <Link href="/admin/teacher">
                        <a className="link-primary ">Voltar</a>
                    </Link>
                </div>
            </div>
            <Formik
                enableReinitialize
                initialValues={{ ...teacher, file: undefined, localFileURL }}
                validationSchema={
                    Yup.object().shape({
                        name: Yup.string().required('Preencha este campo.'),
                        about: Yup.string().required('Preencha este campo.'),
                        localFileURL: Yup.string().required('Preencha este campo.'),
                        email: Yup.string().required('Preencha este campo.'),
                        phone: Yup.string().required('Preencha este campo.'),
                    })}
                onSubmit={onSubmit}>
                {({
                    values,
                    isSubmitting,
                    handleSubmit,
                    handleChange,
                    setFieldValue
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                id="name"
                                placeholder="Nome do docente"
                                value={values.name}
                                onChange={handleChange} />
                            <ErrorMessage name="name" className="input-error" />
                        </div>
                        { newTeacher || editingPhoto ?
                            <div className="mb-3">
                                <label htmlFor="localFileURL" className="form-label">Foto</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="localFileURL"
                                    id="localFileURL"
                                    value={values.localFileURL}
                                    onChange={(event) => {
                                        handleChange(event);
                                        setFile(event.currentTarget.files);
                                    }} />

                                <ErrorMessage name="localFileURL" className="input-error" />
                            </div> :
                            <div className="mb-3 text-center">
                            <img src={teacher.photo} className="img-thumbnail" alt="..."></img>
                            <a  className="link-primary d-block mt-3" onClick={editPhoto}>Editar</a>
                            </div>
                        }

                        <div className="mb-3">
                            <label htmlFor="about" className="form-label">Sobre</label>
                            <textarea
                                className="form-control"
                                name="about"
                                id="about"
                                rows={3}
                                value={values.about}
                                onChange={handleChange}
                            ></textarea>
                            <ErrorMessage name="about" className="input-error" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder=""
                                value={values.email}
                                onChange={handleChange} />
                            <ErrorMessage name="email" className="input-error" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Telefone</label>
                            <input
                                type="phone"
                                className="form-control"
                                name="phone"
                                id="phone"
                                placeholder=""
                                value={values.phone}
                                onChange={handleChange} />
                            <ErrorMessage name="phone" className="input-error" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>Salvar</button>
                    </form>
                )}
            </Formik>
        </AdminBase>
    )
}


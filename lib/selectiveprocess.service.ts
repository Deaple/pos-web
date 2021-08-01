import { Course } from "../models/course";
import { ProcessStepsState, SelectiveProcess } from "../models/selective-process";
import firestore from "../utils/firestore-util";


export default function SelectiveProcessService() {

    const selectiveProcessRef = firestore.collection("selectiveprocess");

    async function getInConstruction() {
        let snapshot = await selectiveProcessRef.where('state', "in" ,[ProcessStepsState.IN_CONSTRUCTION, ProcessStepsState.OPEN]).get();
        if (snapshot.size > 0) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            const selectiveProcess: SelectiveProcess = {
                id: doc.id,
                title: data['title'],
                state: data['state'],
                numberPlaces: data['numberPlaces'],
                description: data['description'],
                reservedPlaces: data['reservedPlaces'],
                baremaCategories: data['baremaCategories'],
                processForms: data['processForms'],
                processNotices: data['processNotices'],
                steps: data['steps'],

            }

            return selectiveProcess;
        }
        return null;
    }

    
    async function getOpen() {
        let snapshot = await selectiveProcessRef.where('state', "==" ,ProcessStepsState.OPEN).get();
        if (snapshot.size > 0) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            const selectiveProcess: SelectiveProcess = {
                id: doc.id,
                title: data['title'],
                state: data['state'],
                numberPlaces: data['numberPlaces'],
                description: data['description'],
                reservedPlaces: data['reservedPlaces'],
                baremaCategories: data['baremaCategories'],
                processForms: data['processForms'],
                processNotices: data['processNotices'],
                steps: data['steps'],

            }

            return selectiveProcess;
        }
        return null;
    }

    async function getAll() {
        let courses = [];

        await selectiveProcessRef.get().then(
            (snapshot) => {

                snapshot.forEach(
                    (result) => {
                        const id = result.id;
                        const doc = result.data();
                        const course: Course = {
                            id: id,
                            name: doc['name'],
                            description: doc['description'],
                        }
                        courses.push(course);
                    });

            }
        ).catch(
        );

        return courses;

    }

    async function save(process: SelectiveProcess) {
        selectiveProcessRef.add(process);
    }

    async function update(process: SelectiveProcess) {
        selectiveProcessRef.doc(process.id).update(process);
    }

    async function remove(course: Course) {
        selectiveProcessRef.doc(course.id).delete();
    }

    async function getById(id) {
        let snapshot = await selectiveProcessRef.doc(id).get();
        const doc = snapshot.data();
        const process: SelectiveProcess = {
            id: id,
            title: doc['title'],
            state: doc['state'],
            numberPlaces: doc['numberPlaces'],
            description: doc['description'],
            reservedPlaces: doc['reservedPlaces'],
            baremaCategories: doc['baremaCategories'],
            processForms: doc['processForms'],
            processNotices: doc['processNotices'],
            steps: doc['steps'],
        }
        return process;
    }


    return {
        getInConstruction,
        getAll,
        save,
        update,
        remove,
        getById,
        getOpen
    }

}

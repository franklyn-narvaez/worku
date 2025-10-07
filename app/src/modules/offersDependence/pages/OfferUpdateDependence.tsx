import type { College, Faculty, Offer } from "@prisma/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_COLLEGE, GET_FACULTY } from "@/constants/path";
import UpdateFormDependence from "../components/UpdateFormDependence";

type OfferWithCollege = Offer & {
    college: {
        id: string;
        name: string;
    } | null;
    faculty: {
        id: string;
        name: string;
    } | null;
};

export default function OfferUpdateDependence() {

    const { id } = useParams();

    const [offer, setOffer] = useState<OfferWithCollege>();
    const [colleges, setColleges] = useState<College[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);

    useEffect(() => {
        fetch(GET_COLLEGE)
            .then((res) => res.json())
            .then((data) => setColleges(data));
    }, []);

    useEffect(() => {
        fetch(GET_FACULTY)
            .then((res) => res.json())
            .then((data) => setFaculties(data));
    }, []);
    useEffect(() => {
        fetch(`http://localhost:3000/api/offer/${id}`)
            .then((res) => res.json())
            .then((data) => setOffer(data));
    }, [id]);

    return (
        <div className="p-6 gap-4">
            {offer && <UpdateFormDependence offer={offer} college={colleges} faculty={faculties} />}
        </div>
    );
}

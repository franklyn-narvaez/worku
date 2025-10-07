import { useNavigate } from "react-router-dom";
import OfferTable from "../components/OfferTable";
import { DEPENDENCE_OFFER_CREATE } from "@/constants/path";

export default function OffersDependence() {

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(DEPENDENCE_OFFER_CREATE);
    }
    return (
        <div className="p-6 gap-4">
            <div className="flex justify-between items-center pb-2">
                <button type="button" onClick={handleNavigate} className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition">
                    Crear oferta
                </button>
            </div>
            <OfferTable />
        </div>
    );
}

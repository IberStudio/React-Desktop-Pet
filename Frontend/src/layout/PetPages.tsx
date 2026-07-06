import ContextMenu from "../features/Pet/component/ContextMenu";
import PetSelector from "../features/Pet/component/PetSelector";
import { usePet } from "../features/Pet/hook/PetContext"



const PetPages = () => {
    

    const {
    } = usePet();

    return (
        <div
        className={`h-full flex flex-col gap-1`}
        >
            <PetSelector />
            <div
            className={`h-full flex-5`}
            >
                <ContextMenu />
            </div>
        </div>
    )
}

export default PetPages
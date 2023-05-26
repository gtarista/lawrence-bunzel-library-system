
export const useModal = () => {
    function openAccountModal () {
        document.getElementById("mySidebar").style.width = "500px";
        document.getElementById("main").style.opacity = "0.5";
    };
    
    function closeAccountModal() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.opacity = "1";
        document.getElementById("main").style.transform = "";
    };
    return {openAccountModal, closeAccountModal};
};
const logout = () => {
    window.localStorage.clear();
    window.location.href = `${window.location.origin}/login`
}
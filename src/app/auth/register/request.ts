async function registerRequets(data: any) {
    return await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            collegeId: data.college,
            password: data.password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

}

export default registerRequets;
// app/filters/page.js
"use client"
import React, { useEffect, useState } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthService from '@/services/AuthService';
import Navbar from '@/components/Navbar';

const Filters = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || '';
  const name = searchParams.get('name') || '';
  const logAfter = searchParams.get('logAfter') || '';
  const logBefore = searchParams.get('logBefore') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchFilteredUsers = async () => {
      const filters = {
        deleted: status,
        name: name,
        loginAfter: logAfter,
        loginBefore: logBefore,
      };
      const data = await AuthService.findUsers(filters);
      setUsers(data);
    };
    fetchFilteredUsers();
  }, [status, name, logAfter, logBefore, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`/filters?${params.toString()}`);
  };

  return (
    <Container>
      <Navbar />
      <h1>Filtros</h1>
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="statusFilterLabel">Filtrar por estado</InputLabel>
        <Select
          labelId="statusFilterLabel"
          id="statusFilter"
          name="status"
          value={status}
          onChange={handleInputChange}
        >
          <MenuItem value="false">Activos</MenuItem>
          <MenuItem value="true">Inactivos</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Filtrar por nombre"
        variant="outlined"
        name="name"
        value={name}
        onChange={handleInputChange}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        label="Filtrar por fecha de inicio de sesión después de"
        variant="outlined"
        type="date"
        name="logAfter"
        value={logAfter}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        label="Filtrar por fecha de inicio de sesión antes de"
        variant="outlined"
        type="date"
        name="logBefore"
        value={logBefore}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: '20px' }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.status ? 'Activo' : 'Inactivo'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Filters;

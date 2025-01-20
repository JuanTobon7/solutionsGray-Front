<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 min-h-screen flex items-center justify-center">
      <div class="container px-2 mx-auto max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl overflow-hidden flex items-center justify-center">
        <div class="relative bg-white sm:px-10 p-4 rounded-lg shadow-lg max-h-[95vh] overflow-auto px-3">
          <div class="flex items-center justify-between  mb-4 gap-2">
            <h1 class="text-3xl font-bold text-center text-second-800">Roles y Permisos de Viddefe</h1>
            <button @click="$emit('close')" class="material-symbols-outlined text-second-800 text-2xl">close</button>
          </div>
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-semibold text-second-700">1. Usuario (Servidor Común)</h2>
              <p class="text-primary-800">Descripción: Miembro regular que participa en las actividades de la iglesia.</p>
              <ul class="list-disc list-inside mt-2 text-primary-900">
                <li><strong>Registrar personas nuevas:</strong> Puede agregar personas al sistema, como invitados o nuevos miembros.</li>
                <li><strong>Gestionar asistencia a cultos:</strong> Marcar su propia asistencia o la de personas asignadas (por ejemplo, familiares).</li>
              </ul>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-second-700">2. Admin (Líder)</h2>
              <p class="text-primary-800">Descripción: Líder a cargo de grupos o áreas específicas dentro de la iglesia. Puede gestionar aspectos administrativos básicos y asistir al Super Admin.</p>
              <ul class="list-disc list-inside mt-2 text-primary-900">
                <li><strong>Descargar reportes de ofrendas por culto:</strong> Exportar datos de las ofrendas en un formato de informe.</li>
                <li><strong>Gestionar ofrendas por culto:</strong> Registrar, editar y consultar las ofrendas recolectadas en cada culto.</li>
                <li><strong>Gestionar ingresos por culto:</strong> Registrar otros ingresos específicos asociados a un culto.</li>
                <li><strong>Ingresar servidores en la app:</strong> Añadir y asignar servidores (usuarios) a roles o áreas dentro de la iglesia.</li>
                <li><strong>Todo lo que puede hacer un Usuario.</strong></li>
              </ul>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-second-700">3. Super Admin (Mano derecha del Pastor)</h2>
              <p class="text-primary-800">Descripción: Responsable de la administración avanzada de la iglesia y de coordinar la estructura funcional.</p>
              <ul class="list-disc list-inside mt-2 text-primary-900">
                <li><strong>Cambiar roles de usuarios:</strong> Asignar o modificar los roles de los miembros registrados en la app.</li>
                <li><strong>Módulo de ingresos generales:</strong> Gestionar ingresos globales de la iglesia, no asociados a un culto específico.</li>
                <li><strong>Crear cursos o procesos de discipulado:</strong> Diseñar programas de discipulado con horarios y temas.</li>
                <li><strong>Asignar servidores como profesores:</strong> Nombrar servidores como instructores de cursos, con sus respectivos horarios.</li>
                <li><strong>Agendar cultos y asignar servicios:</strong> Programar cultos y asignar roles o tareas específicas a los servidores.</li>
                <li><strong>Todo lo que puede hacer un Admin.</strong></li>
              </ul>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-second-700">4. Pastor</h2>
              <p class="text-primary-800">Descripción: Máxima autoridad espiritual y administrativa de la iglesia. Supervisa todo y realiza cambios importantes.</p>
              <ul class="list-disc list-inside mt-2 text-primary-900">
                <li><strong>Cambiar la información de la iglesia:</strong> Actualizar datos generales como nombre, ubicación, contactos, etc.</li>
                <li><strong>Supervisión global:</strong> Puede revisar reportes, ingresos y cultos sin realizar modificaciones (opcional).</li>
                <li><strong>Todo lo que puede hacer un Super Admin.</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Appointments",
      [
        {
          physicianId: 1,
          patientId: 5,
          appointmentDate: "2021-05-10",
          description: "Exam Analysis",
        },
        {
          physicianId: 1,
          patientId: 6,
          appointmentDate: "2021-05-18",
          description: "Exam Analysis",
        },
        {
          physicianId: 2,
          patientId: 2,
          appointmentDate: "2021-05-20",
          description: "Exam Analysis",
        },
        {
          physicianId: 2,
          patientId: 1,
          appointmentDate: "2021-05-21",
          description: "Exam Analysis",
        },
        {
          physicianId: 3,
          patientId: 3,
          appointmentDate: "2021-05-25",
          description: "Exam Analysis",
        },
        {
          physicianId: 3,
          patientId: 6,
          appointmentDate: "2021-05-26",
          description: "Exam Analysis",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Appointments", null, {});
  },
};

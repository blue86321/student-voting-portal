FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the Maven project files to the container
COPY pom.xml .
COPY src ./src
COPY .mvn ./.mvn
COPY mvnw ./mvnw

# Build the Maven project
RUN ./mvnw package -DskipTests
RUN mv target/student_voting_portal-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
# ENTRYPOINT ["./mvnw", "spring-boot:run"]

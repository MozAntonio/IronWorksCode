package jdbc.helpers;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class Database {
	private static String db_driver_class;
	private static String db_url;
	private static String db_username;
	private static String db_password;

   static  {
        Properties config = new Properties();
        try {
            config.load(new FileInputStream("config.properties"));
            db_driver_class = config.getProperty("DB_DRIVER_CLASS");
            db_url = config.getProperty("DB_URL");
            db_username = config.getProperty("DB_USERNAME");
            db_password = config.getProperty("DB_PASSWORD");
            Class.forName( db_driver_class );
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        catch ( ClassNotFoundException e ) {
            System.out.println( "Driver class not found" );
        }

    }

    public static Connection getConnection() throws SQLException {
       return DriverManager.getConnection(db_url, db_username, db_password);
    }
}
